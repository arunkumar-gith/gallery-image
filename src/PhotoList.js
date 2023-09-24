import React, { useState, useEffect, useRef } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

function PhotoList() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(
          `https://picsum.photos/v2/list?page=${page}&limit=100`
        );
        const data = await response.json();
        setPhotos((prevPhotos) => [...prevPhotos, ...data]);
        setPage(page + 1);
      } catch (error) {
        console.error(error);
      }
    };

    // Create an intersection observer
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPhotos();
      }
    });

    // Start observing the loader element
    const loaderElement = loader.current;
    if (loaderElement) {
      observer.observe(loaderElement);
    }

    // Cleanup the observer
    return () => {
      if (loaderElement) {
        observer.unobserve(loaderElement);
      }
    };
  }, [page]);

  return (
    <>
      <div className="App">
        <div className="header">
          <div className="logo">
            <span className="content-logo">Logo</span>
          </div>
          <div className="title">
            <span className="content-title">Site Title</span>
          </div>
        </div>
        <div className="headImage">Head Image</div>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter="10px">
            {photos.map((photo) => (
              <img
                key={photo.id}
                src={photo.download_url}
                alt={`Photo by ${photo.author}`}
                style={{ width: "100%", display: "block", margin: "10px" }}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
        <div className="loader" ref={loader}>
          Loading...
        </div>
      </div>
    </>
  );
}

export default PhotoList;
