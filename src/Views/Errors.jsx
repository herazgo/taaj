import React from 'react';

export const Error404 = ({ location }) => (
    <div>
        <h3>
        آدرس یافت نشد: <code className="d-inline-block ltr">{location.pathname}</code>
        </h3>
    </div>
)

export const Error401 = ({ location }) => (
    <div>
        <h3>
            شما مجوز دسترسی به این صفحه را ندارید
        </h3>
    </div>
)