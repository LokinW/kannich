import React, { useState, useEffect } from 'react';
import locations from "../germany-latest.json";
import styles from "./LocationChecker.module.css";
import helpSVG from "../assets/help-circle.svg";
import xSVG from "../assets/x-circle.svg";
import checkSVG from "../assets/check-circle-broken.svg";
import refreshSVG from "../assets/refreshIcon.svg";

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

function withinRangeHaversine(myLat, myLon, pointLat, pointLon, threshold) {
  const distance = haversineDistance(myLat, myLon, pointLat, pointLon);
  return distance <= threshold;
}

const LocationChecker = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isWithinRange, setIsWithinRange] = useState("Keine Antwort.");
  const [svgIndicator, setSvgIndicator] = useState(helpSVG);
  const [isLoading, setIsLoading] = useState(false); // State to track loading state
  const thresholdRange = 200;

  useEffect(() => {
    getLocation();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const getLocation = () => {
    setIsLoading(true); // Set loading state to true when getLocation is called
    const successHandler = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      checkRange(position.coords.latitude, position.coords.longitude);
      setIsLoading(false); // Set loading state to false when getLocation is successful
    };

    const errorHandler = (error) => {
      setError(error.message);
      setIsLoading(false); // Set loading state to false when getLocation fails
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  };

  const checkRange = (lat, lon) => {
    const germanyBoundingBox = {
      minLat: 47.270111,
      maxLat: 55.05814,
      minLon: 5.866315,
      maxLon: 15.041896
    };

    // Check if the location is within the bounding box of Germany
    const withinGermany = (
      lat >= germanyBoundingBox.minLat &&
      lat <= germanyBoundingBox.maxLat &&
      lon >= germanyBoundingBox.minLon &&
      lon <= germanyBoundingBox.maxLon
    );

    if (withinGermany) {
      // Check if the location is near any restricted areas within Germany
      const categories = ['playgrounds', 'schools', 'sport_locations', 'kindergartens'];
      let messages = [];

      for (const category of categories) {
        for (const location of locations[category]) {
          if (withinRangeHaversine(lat, lon, location.latitude, location.longitude, thresholdRange)) {
            const name = location.name || category.replace('_', ' ');
            messages.push(`Leider zu nah an ${name}.`);
            break;
          }
        }
      }

      setSvgIndicator(messages.length > 0 ? xSVG : checkSVG);
      setIsWithinRange(messages.length > 0 ? messages.join(" ") : "Blaze it.");
    } else {
      // Location is outside Germany
      setSvgIndicator(xSVG);
      setIsWithinRange("Location is outside Germany.");
    }
  };


  return (
    <div className={styles.locationchecker}>
      <div className={styles.svgIndicator}>
        {isLoading && <img src={refreshSVG} alt="refresh" className={styles.refreshIcon} />}
        <img src={svgIndicator} alt="svg" />
        <p>{isWithinRange}</p> 
      </div>
      <p>Mein Standort:</p>
      <p>{latitude ? `${latitude},${longitude}` : "leer"}</p>
      <button onClick={getLocation}>
        Neu Laden
        {isLoading && <img src={refreshSVG} alt="refresh" className={styles.refreshIcon} />}
      </button>
    </div>
  );
};

export default LocationChecker;
