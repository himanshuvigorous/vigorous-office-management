import React from 'react';
import { useLocation, Link } from 'react-router-dom';


const decodeSegment = (segment) => {

  if (segment && segment.startsWith('U2F')) {

    return ; 
  }
  return segment;
};

const Breadcrumb = () => {
  const location = useLocation();

 
  const pathSegments = location.pathname.split('/').filter((segment) => segment);

 
  const breadcrumbItems = pathSegments.map((segment, index) => {

    if (segment === 'admin') return null; 
    
  
    const decodedSegment = decodeSegment(segment);

 
   if(decodedSegment){ const breadcrumbPath = `/${pathSegments.slice(0, index + 1).join('/')}`;

    return { title: decodedSegment, path: breadcrumbPath };}
  }).filter(Boolean); 

  return (
    <nav>
    <ol className="capitalize text-[14px]  text-gray-600 flex items-center my-2">
      {breadcrumbItems.length > 1 && breadcrumbItems.map((item, index) => (
        <li key={index} className={`${index === breadcrumbItems.length - 1 ? 'active' : ''}`}>
          {index === breadcrumbItems.length - 1 ? (
            item.title
          ) : (
            <>
              <Link to={item.path}>{item.title}</Link>
              <span className="mx-2"> &gt; </span> 
            </>
          )}
        </li>
      ))}
    </ol>
  </nav>
  
  );
};

export default Breadcrumb;

