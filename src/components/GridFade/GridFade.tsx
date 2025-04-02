import React, { useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';

interface ImageNode {
  node: {
    id: string;
    relativeDirectory: string;
    childImageSharp: {
      gatsbyImageData: any;
    };
  };
}

interface GridFadeProps {
  directory: string; // Directory name as a prop
  singleRow?: boolean;
}

const GridFade: React.FC<GridFadeProps> = ({ directory, singleRow }) => {
  const data = useStaticQuery(graphql`
    query {
      allFile(filter: { extension: { regex: "/(jpg|jpeg|png|gif)/" } }) {
        edges {
          node {
            id
            relativeDirectory
            childImageSharp {
              gatsbyImageData(
                layout: CONSTRAINED
                aspectRatio: 0.5625
                placeholder: BLURRED
                quality: 80
                transformOptions: { cropFocus: CENTER }
              )
            }
          }
        }
      }
    }
  `);
  // Filter the images based on the directory prop
  const images = data.allFile.edges.filter(
    ({ node }: ImageNode) => node.relativeDirectory === directory,
  );

  // State to manage the grayscale toggle for each image
  const [toggledItems, setToggledItems] = useState<{ [key: string]: boolean }>(
    {},
  );

  // Toggle grayscale on click
  const handleToggle = (id: string) => {
    setToggledItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className={`grid-container ${singleRow ? 'single-row' : null}`}>
      {images.map(({ node }: ImageNode, index: number) => {
        const imageData =
          node.childImageSharp.gatsbyImageData.images.fallback.src;
        const isToggled = toggledItems[node.id];

        return (
          <button
            key={node.id}
            className={`grid-item`}
            // className={`grid-item ${index % 2 === 0 ? 'even' : 'odd'}`}
            style={{
              backgroundImage: `url(${imageData})`,
              filter: isToggled ? 'grayscale(0%)' : 'grayscale(100%)',
            }}
            onClick={() => handleToggle(node.id)}
          ></button>
        );
      })}
    </div>
  );
};

export default GridFade;
