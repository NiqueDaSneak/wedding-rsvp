// gatsby-ssr.js
import React from 'react';

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      key="google-fonts"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Playwrite+TZ:wght@400&display=swap"
    />,
  ]);
};
