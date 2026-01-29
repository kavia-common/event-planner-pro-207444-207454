# Backend API Interface (OpenAPI)

This folder contains a downloaded snapshot of the backend OpenAPI spec used by the frontend.

Current status:
- The spec currently only exposes a health check route (`/`).
- The frontend is implemented against the work-item contract endpoints:
  - `/events` CRUD
  - `/events/{id}/rsvps` CRUD

When the backend adds these routes, update `interfaces/event_backend_openapi.json` and (optionally) refine the typed models/services.
