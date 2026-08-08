import { useContent } from '../content/useContext';

var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

export default function QuickLinksSection() {
  const { content, isLoading } = useContent();
  const quickLinks = content.quickLinks || [];
  
  // If still loading, return null
  if (isLoading) {
    return null;
  }
  
  if (quickLinks.length === 0) return null;
  
  return (
     <section className="py-16 bg-white dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {quickLinks.map((link, index) => (
            <li key={index} className="group">
              <div className="mb-4">
                <a 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                  onClick={triggerHaptic}
                >
                  <img 
                    src={link.icon} 
                    alt={link.alt} 
                    className="w-24 h-24 mx-auto transition-transform group-hover:scale-110"
                  />
                </a>
              </div>
              <div className="desc_stats">
                <h3 className="text-lg font-bold">
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-800 dark:text-white hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
                    onClick={triggerHaptic}
                  >
                    {link.title}
                  </a>
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/*import { useContent } from '../content/useContext';

const triggerHaptic = () => {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

const QuickLinksSection = () => {
  const { content, isLoading } = useContent();
  const quickLinks = content.quickLinks || [];
  
  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (quickLinks.length === 0) return null;
  
  return (
    <section className="py-16 bg-white dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {quickLinks.map((link, index) => (
            <li key={index} className="group">
              <div className="mb-4">
                <a 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                  onClick={triggerHaptic}
                >
                  <img 
                    src={link.icon} 
                    alt={link.alt} 
                    className="w-24 h-24 mx-auto transition-transform group-hover:scale-110"
                  />
                </a>
              </div>
              <div className="desc_stats">
                <h3 className="text-lg font-bold">
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-800 dark:text-white hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
                    onClick={triggerHaptic}
                  >
                    {link.title}
                  </a>
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default QuickLinksSection;*/

