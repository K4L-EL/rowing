"use client";

import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind } from "lucide-react";
import { ClayCard } from "@/components/clay-card";

type WeatherData = {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
};

const CACHE_KEY = "rowsafe_weather";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const LAT = process.env.NEXT_PUBLIC_CLUB_LAT ?? "51.5074";
const LON = process.env.NEXT_PUBLIC_CLUB_LON ?? "-0.1278";

function weatherIcon(code: number) {
  if (code === 0) return Sun;
  if (code <= 3) return Cloud;
  if (code <= 48) return CloudFog;
  if (code <= 57) return CloudRain;
  if (code <= 77) return CloudSnow;
  if (code <= 82) return CloudRain;
  if (code <= 86) return CloudSnow;
  if (code <= 99) return CloudLightning;
  return Cloud;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check cache
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached) as { data: WeatherData; timestamp: number };
        if (Date.now() - timestamp < CACHE_TTL) {
          setWeather(data);
          setLoading(false);
          return;
        }
      }
    } catch {
      // ignore cache errors
    }

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`)
      .then((r) => r.json())
      .then((data) => {
        const current = data.current;
        const w: WeatherData = {
          temperature: current.temperature_2m,
          weatherCode: current.weather_code,
          windSpeed: current.wind_speed_10m,
        };
        setWeather(w);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: w, timestamp: Date.now() }));
        } catch {
          // ignore storage errors
        }
      })
      .catch(() => {
        // silently fail — non-critical widget
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !weather) return null;

  const Icon = weatherIcon(weather.weatherCode);

  return (
    <ClayCard className="flex items-center gap-4 p-4">
      <span className="clay-sm inline-flex size-10 items-center justify-center bg-clay-sky text-foreground">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-2xl font-black text-foreground">{Math.round(weather.temperature)}°C</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Wind className="size-3" />
          {Math.round(weather.windSpeed)} km/h
        </p>
      </div>
    </ClayCard>
  );
}
