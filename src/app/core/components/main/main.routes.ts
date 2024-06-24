import { Routes } from '@angular/router';
import { MainComponent } from './main.component';


export const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: [
          {
            path: "",
            redirectTo: "clients",
            pathMatch: "full"
          },
          {
            path: "clients",
            loadComponent: () => import('../../../modules/components/clients/clients.component').then(c => c.ClientsComponent),
          },
        //   {
        //     path: "clients",
        //     loadComponent: () => import('./components/clients/clients.component').then(c => c.ClientsComponent),
        //     // canActivate: [InternalOnlyGuard, AdminTemporalGuard]
        //   },
        ]
      },
  ];