import { create } from "zustand";
import { shallow } from "zustand/shallow"; // shallow 비교 사용

interface WeatherState {
  weatherData: any | null;
  airQualityData: any | null;
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
  error: string | null;
  fetchWeatherData: (id: number) => Promise<void>;
  fetchAirQualityData: (id: number) => Promise<void>;
}

const useWeatherStore = create<WeatherState>((set) => ({
  weatherData: null,
  airQualityData: null,
  loading: false,
  setLoading: (isLoading) => set({ loading: isLoading }),
  error: null,

  fetchWeatherData: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/acweather?id=${id}`
      );
      if (!response.ok) throw new Error("Weather data fetch failed.");
      const data = await response.json();
      set({ weatherData: data.weatherDataJson, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: String(error), loading: false }); // 다른 타입의 에러 처리
      }
    }
  },

  fetchAirQualityData: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/air/current?id=${id}`
      );
      if (!response.ok) throw new Error("Air quality data fetch failed.");
      const data = await response.json();
      set({ airQualityData: data.data, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: String(error), loading: false }); // 다른 타입의 에러 처리
      }
    }
  },
}));

export const useWeatherSelector = (selector: (state: WeatherState) => any) =>
  useWeatherStore(selector, shallow);
