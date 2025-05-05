import { Role } from "../roles/auth.roles.entity";

interface jwtPayload {
    id: string;
    nama: string;
    email: string;
    role: string | string[];
    userRole: Role[];
  }