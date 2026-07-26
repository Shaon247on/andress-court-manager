// components/registration/RegistrationSteps.ts (or wherever you define steps)

import { Building2, MapPin, Globe, Trophy, CalendarDays, FileText } from 'lucide-react';

export const registrationSteps = [
  { id: 1, label: 'Basic Info', icon: Building2 },
  { id: 2, label: 'Location Details', icon: MapPin },
  { id: 3, label: 'Map Location', icon: Globe },
//   { id: 4, label: 'Facility', icon: Trophy },
  { id: 4, label: 'Schedule', icon: CalendarDays },
  { id: 5, label: 'Terms', icon: FileText }
];