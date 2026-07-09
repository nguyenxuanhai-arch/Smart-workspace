import { useEffect } from 'react';

function setMetaTag(attrName, attrValue, content) {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export default function SEO({ title, description, image, url }) {
  useEffect(() => {
    if (title) {
      const fullTitle = `${title} | Smart Workspace`;
      document.title = fullTitle;
      setMetaTag('property', 'og:title', fullTitle);
    }
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
    }
    if (image) {
      setMetaTag('property', 'og:image', image);
    }
    if (url) {
      setMetaTag('property', 'og:url', url);
    }
  }, [title, description, image, url]);

  return null;
}
