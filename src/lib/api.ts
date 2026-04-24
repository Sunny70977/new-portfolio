// src/lib/api.ts  — centralised axios instance
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    headers: { "Content-Type": "application/json" },
});

// Attach JWT on every request if available
api.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ────────── Auth ──────────
export const devLogin = (phoneNumber: string) =>
    api.post("/api/auth/dev-login", { phoneNumber });

export const firebaseLogin = (idToken: string) =>
    api.post(
        "/api/auth/firebase-login",
        {},
        { headers: { Authorization: `Bearer ${idToken}` } }
    );

// ────────── Public interview endpoints ──────────
export const getSlots = () => api.get("/api/interviews/slots");

export const bookInterview = (payload: {
    availabilityId: number;
    recruiterName: string;
    recruiterEmail: string;
    recruiterCompany: string;
    recruiterPhone: string;
    message?: string;
}) => api.post("/api/interviews/book", payload);

// ────────── Admin interview endpoints ──────────
export const getAllBookings = () => api.get("/api/interviews/bookings");

export const cancelBooking = (id: number) =>
    api.delete(`/api/interviews/bookings/${id}`);

// ────────── Admin availability endpoints ──────────
export const getAdminSlots = () => api.get("/api/admin/availability");

export const addSlot = (payload: {
    date: string;
    startTime: string;
    endTime: string;
}) => api.post("/api/admin/availability", payload);

export const deleteSlot = (id: number) =>
    api.delete(`/api/admin/availability/${id}`);

export default api;
