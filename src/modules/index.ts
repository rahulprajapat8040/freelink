import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";
import { ClientModule } from "./client/client.module";
import { FreelancerModule } from "./freelancer/freelancer.module";

export const Modules = [AuthModule, ClientModule, FreelancerModule, AdminModule]