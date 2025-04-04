import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./Pages/Public/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home-admin',
    loadChildren: () => import('./Pages/Secure/home-admin/home-admin.module').then( m => m.HomeAdminPageModule)
  },
  {
    path: 'home-asesor',
    loadChildren: () => import('./Pages/Secure/home-asesor/home-asesor.module').then( m => m.HomeAsesorPageModule)
  },
  {
    path: 'home-cliente',
    loadChildren: () => import('./Pages/Secure/home-cliente/home-cliente.module').then( m => m.HomeClientePageModule)
  },
  {
    path: 'casas',
    loadChildren: () => import('./Pages/Secure/casas/casas.module').then( m => m.CasasPageModule)
  },
  {
    path: 'citas',
    loadChildren: () => import('./Pages/Secure/citas/citas.module').then( m => m.CitasPageModule)
  },
  {
    path: 'negociacion',
    loadChildren: () => import('./Pages/Secure/negociacion/negociacion.module').then( m => m.NegociacionPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./Pages/Secure/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'roles',
    loadChildren: () => import('./Pages/Secure/roles/roles.module').then( m => m.RolesPageModule)
  },
  {
    path: 'citas-admin',
    loadChildren: () => import('./Pages/Secure/citas-admin/citas-admin.module').then( m => m.CitasAdminPageModule)
  },
  {
    path: 'citas-asesor',
    loadChildren: () => import('./Pages/Secure/citas-asesor/citas-asesor.module').then( m => m.CitasAsesorPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
