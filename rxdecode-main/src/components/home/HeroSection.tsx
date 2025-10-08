import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center justify-center px-4 bg-background pt-24">
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 text-foreground leading-tight">
            AI That Translates Your <span className="italic">Prescription</span> into <span className="italic">Clarity.</span>
          </h1>
          <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto font-sans">
            RxDecode instantly analyzes prescriptions or medicines you upload—giving you complete insights into dosage, usage, and safety, Powered by Gemini AI.
          </p>
          <Link to="/generate">
            <Button 
              size="lg" 
              className="bg-gradient-to-t from-[#0700FF] to-[#5661F9] hover:opacity-90 text-white px-12 py-6 text-lg font-sans font-medium rounded-lg transition-opacity"
            >
              Generate
            </Button>
          </Link>
          
          <VideoOnView />
        </div>
      </div>
    </section>
  );
};

const VideoOnView = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoEl) return;
        if (entry.isIntersecting) {
          try {
            videoEl.currentTime = 0;
            const playPromise = videoEl.play();
            if (playPromise && typeof (playPromise as any).then === 'function') {
              (playPromise as Promise<void>).catch(() => {});
            }
          } catch {}
        } else {
          videoEl.pause();
          videoEl.currentTime = 0;
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(videoEl);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="mt-20 max-w-5xl mx-auto autoplay">
      <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
        <video
          ref={videoRef}
          className="w-full h-full"
          src="/rxdecode_.mp4"
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  );
};

export default HeroSection;