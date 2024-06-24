import { Routes } from '@angular/router';
import { MainComponent } from './core/components/main/main.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "main",
        pathMatch: "full",
    },
    {
        path: "main",
        // loadComponent: () => import('./core/components/main/main.component').then(c => c.MainComponent)
        loadChildren: () => import('./core/components/main/main.routes').then(m => m.routes),
    },
     
];
