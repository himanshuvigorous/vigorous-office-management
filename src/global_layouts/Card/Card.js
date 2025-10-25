import React from 'react';

const Card = ({
  header,
  footer,
  cardStyle = ' rounded-xl shadow-lg my-3  mx-auto',
  headerStyle = 'p-3 text-lg font-bold',
  bodyStyle = 'p-3 text-gray-700',
  footerStyle = 'bg-gray-100 p-3 text-gray-500 text-sm clearfix',
  className,
  children
}) => {
  return (
    <div className={`card  ${cardStyle} ${className}`}>
      {header && (
        <div className={`card-header ${headerStyle} `}>
          {header}
        </div>
      )}
      <div className={`card-body ${bodyStyle}`}>
        {children}
      </div>

      {footer && <div className={`card-footer ${footerStyle}`}>
        {footer}
      </div>}
    </div>
  );
};

export default Card;
