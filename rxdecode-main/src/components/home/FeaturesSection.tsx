const FeaturesSection = () => {
  const features = [
    {
      shape: "triangle",
      title: "AI-Powered Analysis",
      description: "Advanced Gemini AI instantly analyzes prescriptions to extract accurate medicine information and dosage details."
    },
    {
      shape: "square",
      title: "Instant Medicine Search",
      description: "Search any medicine by name to get comprehensive information including usage, side effects, and precautions."
    },
    {
      shape: "circle",
      title: "Prescription Upload",
      description: "Simply upload a photo of your prescription and let our OCR technology extract all the details automatically."
    },
    {
      shape: "diamond",
      title: "Privacy Focused",
      description: "Your medical data stays private and secure. We provide information, not medical advice, for educational purposes only."
    }
  ];

  const shapes = {
    triangle: (
      <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[52px] border-b-yellow-400" />
    ),
    square: (
      <div className="w-[52px] h-[52px] bg-rose-400" />
    ),
    circle: (
      <div className="w-[52px] h-[52px] rounded-full bg-red-400" />
    ),
    diamond: (
      <div className="w-[37px] h-[37px] bg-blue-500 rotate-45" />
    )
  };

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="space-y-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start">
                {shapes[feature.shape as keyof typeof shapes]}
              </div>
              <h3 className="text-3xl md:text-4xl font-serif text-foreground leading-tight">
                {feature.title}
              </h3>
              <p className="text-lg text-muted-foreground font-sans leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;