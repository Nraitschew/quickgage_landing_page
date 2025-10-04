import React, { useState, useEffect, useRef } from 'react';

const QuickgageLanding = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [stars, setStars] = useState([]);
  const sectionsRef = useRef([]);

  // Generate random stars for starfield
  useEffect(() => {
    const generateStars = () => {
      const starCount = 100;
      const newStars = [];
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size: Math.random() > 0.5 ? '2px' : '1px',
          duration: `${3 + Math.random() * 4}s`,
          delay: `${Math.random() * 3}s`
        });
      }
      setStars(newStars);
    };
    generateStars();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    try {
      // Submit to backend API
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert('Thanks for joining the waitlist! We\'ll be in touch soon.');
        setEmail('');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setEmailError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Animated Starfield Background */}
      <div className="fixed inset-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDuration: star.duration,
              animationDelay: star.delay
            }}
          />
        ))}
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#0a0a0f]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-xl font-light tracking-tight" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Quickgage
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 rounded-full border border-white/10 text-sm text-gray-400 mb-8">
            AI Voice Personalization
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight mb-8 leading-tight">
            The wait is part of the{' '}
            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>journey.</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Train AI to write in your authentic voice using your existing content.
            No more generic AI output. Just you, amplified.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm focus:border-white/30 focus:outline-none transition-all duration-300"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-black rounded-xl font-medium hover:opacity-90 transition-opacity duration-300"
              >
                Get Notified
              </button>
            </div>
            {emailError && <p className="text-[#E07A5F] text-sm mt-2">{emailError}</p>}
          </form>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            ref={(el) => (sectionsRef.current[0] = el)}
            className="scroll-animate text-4xl md:text-5xl font-light text-center mb-20 tracking-tight"
          >
            Why most AI content fails
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div
              ref={(el) => (sectionsRef.current[1] = el)}
              className="scroll-animate text-center"
              style={{ animationDelay: '0.1s' }}
            >
              <h3 className="text-2xl font-light mb-4">Generic</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                AI writes like everyone else. Same patterns, same phrases, same forgettable output.
              </p>
            </div>
            <div
              ref={(el) => (sectionsRef.current[2] = el)}
              className="scroll-animate text-center"
              style={{ animationDelay: '0.2s' }}
            >
              <h3 className="text-2xl font-light mb-4">Inauthentic</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Your audience can tell. It doesn't sound like you because it isn't you.
              </p>
            </div>
            <div
              ref={(el) => (sectionsRef.current[3] = el)}
              className="scroll-animate text-center"
              style={{ animationDelay: '0.3s' }}
            >
              <h3 className="text-2xl font-light mb-4">Time-consuming</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Endless editing to make AI sound human defeats the purpose of automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            ref={(el) => (sectionsRef.current[4] = el)}
            className="scroll-animate text-4xl md:text-5xl font-light mb-8 tracking-tight"
          >
            What if AI wrote exactly like you?
          </h2>
          <p
            ref={(el) => (sectionsRef.current[5] = el)}
            className="scroll-animate text-xl text-gray-400 font-light leading-relaxed"
            style={{ animationDelay: '0.1s' }}
          >
            Quickgage analyzes your existing writing—emails, articles, social posts—to understand
            your unique voice, tone, and style. Then it generates content that actually sounds like you.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            ref={(el) => (sectionsRef.current[6] = el)}
            className="scroll-animate text-4xl md:text-5xl font-light text-center mb-20 tracking-tight"
          >
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-16">
            <div
              ref={(el) => (sectionsRef.current[7] = el)}
              className="scroll-animate"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="text-6xl font-light text-white/20 mb-6">01</div>
              <h3 className="text-2xl font-light mb-4">Connect</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Link your existing content sources. Email, blog posts, social media—wherever you write.
              </p>
            </div>
            <div
              ref={(el) => (sectionsRef.current[8] = el)}
              className="scroll-animate"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="text-6xl font-light text-white/20 mb-6">02</div>
              <h3 className="text-2xl font-light mb-4">Analyze</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Our AI studies your writing patterns, vocabulary, and unique style nuances.
              </p>
            </div>
            <div
              ref={(el) => (sectionsRef.current[9] = el)}
              className="scroll-animate"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="text-6xl font-light text-white/20 mb-6">03</div>
              <h3 className="text-2xl font-light mb-4">Create</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Generate content that sounds authentically you. No editing marathon required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="relative py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            ref={(el) => (sectionsRef.current[10] = el)}
            className="scroll-animate text-4xl md:text-6xl font-light tracking-tight"
          >
            Authenticity is the new currency
          </h2>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            ref={(el) => (sectionsRef.current[11] = el)}
            className="scroll-animate text-4xl md:text-5xl font-light mb-8 tracking-tight"
          >
            Join the waitlist
          </h2>
          <form
            ref={(el) => (sectionsRef.current[12] = el)}
            onSubmit={handleSubmit}
            className="scroll-animate max-w-md mx-auto mb-8"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm focus:border-white/30 focus:outline-none transition-all duration-300"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-black rounded-xl font-medium hover:opacity-90 transition-opacity duration-300"
              >
                Get Notified
              </button>
            </div>
            {emailError && <p className="text-[#E07A5F] text-sm mt-2">{emailError}</p>}
          </form>
          <p className="text-gray-400 text-sm">
            Questions? Reach us at{' '}
            <a href="mailto:hello@quickgage.com" className="text-white hover:text-gray-300 transition-colors duration-300">
              hello@quickgage.com
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm font-light" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Quickgage
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              Terms
            </a>
          </div>
          <div className="text-sm text-gray-400">© 2024 Quickgage. All rights reserved.</div>
        </div>
      </footer>

      {/* Styles */}
      <style jsx>{`
        /* Starfield twinkle animation */
        .star {
          animation: twinkle ease-in-out infinite;
          opacity: 0.3;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        /* Floating orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          animation: float 8s ease-in-out infinite;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #8B1538, transparent);
          top: -250px;
          left: -250px;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #E07A5F, transparent);
          bottom: -200px;
          right: -200px;
          animation-delay: -4s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }

        /* Scroll animations */
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        /* System font stack */
        body {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
        }
      `}</style>
    </div>
  );
};

export default QuickgageLanding;
