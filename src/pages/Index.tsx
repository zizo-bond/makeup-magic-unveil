import { useState } from "react";
import { Upload, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMakeup = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('remove-makeup', {
        body: { image: selectedImage }
      });

      if (error) throw error;

      if (data?.processedImage) {
        setProcessedImage(data.processedImage);
        toast({
          title: "تم بنجاح! ✨",
          description: "تمت إزالة المكياج من الصورة",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء معالجة الصورة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'no-makeup.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/30 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            إزالة المكياج بالذكاء الاصطناعي
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            احصلي على مظهر طبيعي بالكامل مع تقنية الذكاء الاصطناعي المتقدمة
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Upload Section */}
          <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-right flex items-center justify-end gap-2">
              <span>رفع الصورة</span>
              <Upload className="w-6 h-6 text-primary" />
            </h2>
            
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-border hover:border-primary rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 hover:bg-accent/10 group">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-h-96 mx-auto rounded-xl shadow-lg"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-accent/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground mb-2">
                        اضغط لاختيار صورة
                      </p>
                      <p className="text-sm text-muted-foreground">
                        أو اسحب الصورة وأفلتها هنا
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </label>

            {selectedImage && !processedImage && (
              <Button
                onClick={handleRemoveMakeup}
                disabled={isProcessing}
                className="w-full mt-6 h-12 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-5 h-5 ml-2 animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 ml-2" />
                    إزالة المكياج
                  </>
                )}
              </Button>
            )}
          </Card>

          {/* Result Section */}
          <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-border shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-right flex items-center justify-end gap-2">
              <span>النتيجة</span>
              <Sparkles className="w-6 h-6 text-primary" />
            </h2>
            
            <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center min-h-[400px] flex items-center justify-center">
              {processedImage ? (
                <div className="w-full">
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="max-h-96 mx-auto rounded-xl shadow-lg mb-6"
                  />
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full h-12 text-lg font-semibold border-2 hover:bg-accent"
                  >
                    <Download className="w-5 h-5 ml-2" />
                    تحميل الصورة
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    {selectedImage
                      ? "اضغط على زر 'إزالة المكياج' لبدء المعالجة"
                      : "سيتم عرض النتيجة هنا"}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { title: "سريع وسهل", desc: "معالجة فورية بنقرة واحدة" },
            { title: "نتائج طبيعية", desc: "مظهر طبيعي 100% بدون مكياج" },
            { title: "آمن وخاص", desc: "صورك محمية ولا يتم حفظها" }
          ].map((feature, i) => (
            <Card key={i} className="p-6 text-center bg-card/60 backdrop-blur-sm border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
