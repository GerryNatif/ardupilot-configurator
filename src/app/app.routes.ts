import { Routes } from '@angular/router';
import { Accueil } from './pages/accueil/accueil';
import { Blackbox } from './pages/blackbox/blackbox';
import { Configuration } from './pages/configuration/configuration';
import { Connection } from './pages/connection/connection';
import { Dashboard } from './pages/dashboard/dashboard';
import { Failsafe } from './pages/failsafe/failsafe';
import { Gps } from './pages/gps/gps';
import { Help } from './pages/help/help';
import { LedStrip } from './pages/led-strip/led-strip';
import { Modes } from './pages/modes/modes';
import { ModelEditor } from './pages/model-editor/model-editor';
import { Motors } from './pages/motors/motors';
import { Osd } from './pages/osd/osd';
import { PidTuning } from './pages/pid-tuning/pid-tuning';
import { Power } from './pages/power/power';
import { Receiver } from './pages/receiver/receiver';
import { Rtl } from './pages/rtl/rtl';
import { connectedGuard } from './core/guards/connected.guard';

export const routes: Routes = [
  { path: '', component: Accueil },
  //{ path: 'dashboard', component: Dashboard, canActivate: [connectedGuard] },
  { path: 'connection', component: Connection },
  { path: 'configuration', component: Configuration, canActivate: [connectedGuard] },
  { path: 'power', component: Power, canActivate: [connectedGuard] },
  { path: 'receiver', component: Receiver, canActivate: [connectedGuard] },
  { path: 'failsafe', component: Failsafe, canActivate: [connectedGuard] },
  { path: 'pid-tuning', component: PidTuning, canActivate: [connectedGuard] },
  { path: 'modes', component: Modes, canActivate: [connectedGuard] },
  { path: 'rtl', component: Rtl, canActivate: [connectedGuard] },
  { path: 'model-editor', component: ModelEditor },
  { path: 'motors', component: Motors, canActivate: [connectedGuard] },
  { path: 'gps', component: Gps, canActivate: [connectedGuard] },
  { path: 'osd', component: Osd, canActivate: [connectedGuard] },
  { path: 'led-strip', component: LedStrip, canActivate: [connectedGuard] },
  { path: 'blackbox', component: Blackbox, canActivate: [connectedGuard] },
  { path: 'help', component: Help },
  { path: '**', redirectTo: '' }, // toute route inconnue redirige vers l'accueil
];
