// frontend/src/sections/TestimonialSection.tsx
import React from 'react';
import { useContent } from '../content/useContext';
import TestimonialCard from '../components/TestimonialCard';

const TestimonialSection: React.FC = () => {
  const { content, isLoading } = useContent();
  const testimonials = content.testimonials || [];
  
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-20 bg-primary/5 rounded-3xl my-12">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  if (testimonials.length === 0) return null;
  
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 bg-primary/5 rounded-3xl my-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-primary">Testimonials</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          The ICT Authority implements several programmes and has achieved various milestones as described by multiple stakeholders.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial: any, index: number) => (
          <TestimonialCard
            key={index}
            image={testimonial.image}
            name={testimonial.name}
            handle={testimonial.handle}
            date={testimonial.date}
            quote={testimonial.quote}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;


/*// frontend/src/sections/TestimonialSection.tsx
import React from 'react';
import { useContent } from '../content/useContext';
import TestimonialCard from '../components/TestimonialCard';

const TestimonialSection: React.FC = () => {
  const { content, isLoading } = useContent();
  const testimonials = content.testimonials || [];
  
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-20 bg-primary/5 rounded-3xl my-12">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  if (testimonials.length === 0) return null;
  
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 bg-primary/5 rounded-3xl my-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-primary">Testimonials</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          The ICT Authority implements several programmes and has achieved various milestones as described by multiple stakeholders.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            image={testimonial.image}
            name={testimonial.name}
            handle={testimonial.handle}
            date={testimonial.date}
            quote={testimonial.quote}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;*/

/*// frontend/src/sections/TestimonialSection.tsx
import React from 'react';


const TestimonialSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 bg-primary/5 rounded-3xl my-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-primary">Testimonials</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          The ICT Authority implements several programmes and has achieved various milestones as described by multiple stakeholders.
        </p>
      </div>
      
    </section>
  );
};

export default TestimonialSection;*/
