import 'photoswipe/dist/photoswipe.css';
import { useState } from 'react';

import { Gallery, Item } from 'react-photoswipe-gallery';

const MyGallery = ({ image }) => {
  const [ratio, setRatio] = useState(1);
  return (
    <div>
      <Gallery>
        <Item original={image} width={750 * ratio} height={750}>
          {({ ref, open }) => (
            <img
              ref={ref}
              onClick={(e) => {
                setRatio(e.target.width / e.target.height);
                open();
              }}
              src={image}
              style={{ maxWidth: 200, maxHeight: 200 }}
            />
          )}
        </Item>
      </Gallery>
    </div>
  );
};

export default MyGallery;
