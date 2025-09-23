import React from 'react';
import { Star, Quote } from 'lucide-react';

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Indie Hacker",
      company: "@DataFlowAI",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      content: "PageMint templates saved me weeks of design work. I had my SaaS landing page live in under 4 hours and secured my first paying customer that same week. The code quality and design are exceptional.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Agency Owner",
      company: "PixelCraft Studio",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      content: "As an agency, we've delivered 15+ projects using PageMint templates. The clean code structure and conversion-optimized designs consistently exceed client expectations. We've reduced development time by 75%.",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "SaaS Founder",
      company: "CloudSync Pro",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      content: "PageMint was a game-changer for our startup. We launched CloudSync Pro in one weekend instead of waiting months for custom design. The ROI has been incredible - we've already generated 60x our investment.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Loved by Makers Worldwide
          </h2>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            Join hundreds of successful founders who launched faster with our templates.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl border border-neutral-200 p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="relative mb-6">
                <Quote className="h-6 w-6 text-primary-200 absolute -top-2 -left-2" />
                <p className="text-neutral-700 leading-relaxed pl-4">{testimonial.content}</p>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                  <div className="text-sm text-neutral-600">{testimonial.role}</div>
                  <div className="text-sm text-primary-600">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
