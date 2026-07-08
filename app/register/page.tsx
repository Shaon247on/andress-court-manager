'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, MapPin, Trophy, Globe, FileText, Check, ChevronDown, ChevronLeft, ChevronRight, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const steps = [
   { id: 1, label: 'Basic Info', icon: Building2 },
   { id: 2, label: 'Location Details', icon: MapPin },
   { id: 3, label: 'Map Location', icon: Globe },
   { id: 4, label: 'Facility', icon: Trophy },
   { id: 5, label: 'Terms', icon: FileText }
];

export default function RegisterPage() {
   const [currentStep, setCurrentStep] = useState(1);
   const [showSuccessModal, setShowSuccessModal] = useState(false);

   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [agreed, setAgreed] = useState(false);

   const [formData, setFormData] = useState({
      firstName: 'John',
      lastName: 'Doe',
      clubName: 'Enter your club name',
      email: 'club@example.com',
      phone: '+1 234 567 890',
      password: '',
      confirmPassword: '',
      website: 'https://www.yourclub.com',

      country: 'United States',
      city: 'Enter city name',
      street: '123 Main Street',
      state: 'NY',
      zip: '10001',

      facilityName: 'City Sports Complex',
      clubType: '2v2',
      clubStatus: 'Active',
      courtType: 'Indoor',
      courtNumber: '5',
      sports: 'Football',
   });

   const updateForm = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
   };

   const handleSubmit = () => {
      setShowSuccessModal(true);
   };

   const InputWithIcon = ({ label, required, icon: Icon, rightIcon, ...props }: any) => (
      <div className="flex flex-col">
         <label className="text-sm text-slate-700 font-bold mb-2">
            {label} {required && <span className="text-red-500">*</span>}
         </label>
         <div className="relative">
            {Icon && <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Icon className="w-5 h-5 text-slate-400" />
            </div>}
            <Input className={cn("h-12 border-slate-200 text-slate-700 font-medium", Icon && "pl-11")} {...props} />
            {rightIcon && <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
               {rightIcon}
            </div>}
         </div>
      </div>
   );

   const CustomSelect = ({ label, required, value, onChange, options, placeholder }: any) => (
      <div className="flex flex-col">
         <label className="text-sm text-slate-700 font-bold mb-2">
            {label} {required && <span className="text-red-500">*</span>}
         </label>
         <div className="relative">
            <select
               value={value}
               onChange={onChange}
               className="w-full h-12 px-4 appearance-none rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-700 font-medium cursor-pointer"
            >
               <option value="" disabled>{placeholder || 'Please Select'}</option>
               {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
               <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
         </div>
      </div>
   );

   return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center py-12 px-4">
         {/* Header */}
         <div className="text-center mb-10 w-full max-w-4xl">
            <div className="flex justify-center items-center mb-8">
               <Image
                  src="/assets/athlon_logo.png"
                  alt="AthlonGo Logo"
                  width={250}
                  height={80}
               />
            </div>
            <h2 className="text-[32px] font-bold text-slate-900 mb-2">Welcome to Court Manager</h2>
            <p className="text-slate-500">Let's set up your club profile to get started</p>
         </div>

         {/* Progress Bar */}
         <div className="w-full max-w-[900px] bg-white rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 mb-8 mx-auto flex justify-center items-center">
            <div className="flex items-center">
               {steps.map((step, idx) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;

                  return (
                     <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center w-20">
                           <div className={cn(
                              "w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 mb-3 transition-colors duration-300",
                              isCompleted ? "bg-emerald-500 text-white" : isActive ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                           )}>
                              {isCompleted ? <Check className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                           </div>
                           <span className={cn(
                              "text-[11px] font-bold text-center leading-tight max-w-[80px]",
                              isCompleted || isActive ? "text-slate-900" : "text-slate-500"
                           )}>{step.label}</span>
                        </div>
                        {idx < steps.length - 1 && (
                           <div className={cn(
                              "w-12 md:w-20 h-1 mx-2 -mt-[30px] rounded-full transition-colors duration-300",
                              isCompleted ? "bg-emerald-500" : "bg-slate-200"
                           )} />
                        )}
                     </React.Fragment>
                  )
               })}
            </div>
         </div>

         {/* Form Container */}
         <div className="w-full max-w-[900px] bg-white rounded-2xl p-10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 mb-20 mx-auto">
            <div className="flex items-center mb-8">
               {steps[currentStep - 1].id === 1 && <Building2 className="w-6 h-6 text-emerald-500 mr-3" />}
               {steps[currentStep - 1].id === 2 && <MapPin className="w-6 h-6 text-emerald-500 mr-3" />}
               {steps[currentStep - 1].id === 3 && <Globe className="w-6 h-6 text-emerald-500 mr-3" />}
               {steps[currentStep - 1].id === 4 && <Trophy className="w-6 h-6 text-emerald-500 mr-3" />}
               {steps[currentStep - 1].id === 5 && <FileText className="w-6 h-6 text-slate-900 mr-3" />}
               <h3 className="text-xl font-bold text-slate-900">{steps[currentStep - 1].label}</h3>
            </div>

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-12">
                     <InputWithIcon label="First Name" required value={formData.firstName} onChange={(e: any) => updateForm('firstName', e.target.value)} />
                     <InputWithIcon label="Last Name" required value={formData.lastName} onChange={(e: any) => updateForm('lastName', e.target.value)} />

                     <div className="md:col-span-2">
                        <InputWithIcon label="Club Name" required value={formData.clubName} onChange={(e: any) => updateForm('clubName', e.target.value)} />
                     </div>

                     <InputWithIcon label="Email Address" required icon={Mail} type="email" value={formData.email} onChange={(e: any) => updateForm('email', e.target.value)} />
                     <InputWithIcon label="Phone Number" required icon={Phone} value={formData.phone} onChange={(e: any) => updateForm('phone', e.target.value)} />

                     <InputWithIcon
                        label="Password"
                        required
                        type={showPassword ? "text" : "password"}
                        value={formData.password} onChange={(e: any) => updateForm('password', e.target.value)}
                        placeholder="••••••••"
                        rightIcon={
                           <button onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600">
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                           </button>
                        }
                     />
                     <InputWithIcon
                        label="Confirm Password"
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword} onChange={(e: any) => updateForm('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        rightIcon={
                           <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-400 hover:text-slate-600">
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                           </button>
                        }
                     />

                     <div className="md:col-span-2">
                        <InputWithIcon label="Website (Optional)" icon={Globe} value={formData.website} onChange={(e: any) => updateForm('website', e.target.value)} />
                     </div>
                  </div>
                  <div className="flex justify-end pt-6 border-t border-slate-100">
                     <Button className="h-12 px-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-sm" onClick={() => setCurrentStep(2)}>
                        Next <ChevronRight className="w-5 h-5 ml-2" />
                     </Button>
                  </div>
               </div>
            )}

            {/* Step 2: Location Details */}
            {currentStep === 2 && (
               <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-12">
                     <CustomSelect label="Country" required value={formData.country} onChange={(e: any) => updateForm('country', e.target.value)} options={['United States', 'United Kingdom', 'Canada']} placeholder="Please select Country" />
                     <InputWithIcon label="City" required value={formData.city} onChange={(e: any) => updateForm('city', e.target.value)} />

                     <div className="md:col-span-2">
                        <InputWithIcon label="Street Address" required value={formData.street} onChange={(e: any) => updateForm('street', e.target.value)} />
                     </div>

                     <InputWithIcon label="State/Province" required value={formData.state} onChange={(e: any) => updateForm('state', e.target.value)} />
                     <InputWithIcon label="ZIP/Postal Code" required value={formData.zip} onChange={(e: any) => updateForm('zip', e.target.value)} />
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                     <Button variant="outline" className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50" onClick={() => setCurrentStep(1)}>
                        <ChevronLeft className="w-5 h-5 mr-2" /> Previous
                     </Button>
                     <Button className="h-12 px-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-sm" onClick={() => setCurrentStep(3)}>
                        Next <ChevronRight className="w-5 h-5 ml-2" />
                     </Button>
                  </div>
               </div>
            )}

            {/* Step 3: Map Location */}
            {currentStep === 3 && (
               <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <p className="text-slate-500 text-sm mb-6 -mt-4">Click on the map or search to set your exact location</p>

                  <div className="w-full h-80 rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center mb-6">
                     <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                        <MapPin className="w-8 h-8 text-slate-400" />
                     </div>
                     <h4 className="text-slate-600 font-medium tracking-tight">Click "Search Location" to place your pin</h4>
                     <p className="text-slate-400 text-xs mt-2">Google Maps integration will be enabled in production</p>
                  </div>

                  <div className="p-4 border border-emerald-400 rounded-xl bg-white mb-6 flex items-center text-sm">
                     <span className="font-bold text-emerald-500 mr-2 shrink-0">Address:</span>
                     <span className="text-emerald-500 font-medium truncate">{formData.street}, {formData.city}, {formData.state} {formData.zip}, {formData.country}</span>
                  </div>

                  <Button className="w-full mb-8 bg-emerald-500 hover:bg-emerald-600 h-14 rounded-xl text-lg font-bold shadow-sm">
                     <MapPin className="mr-2 w-6 h-6" /> Search Location on Map
                  </Button>

                  <div className="bg-[#fff9eb] border border-[#ffedc2] p-5 rounded-xl mb-12 flex items-center text-sm font-medium text-[#8a6100]">
                     <span className="font-bold mr-2 text-[#b07c00]">Note:</span> Make sure the pin is placed at your exact club location. This will be used for customer navigation and verification.
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                     <Button variant="outline" className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50" onClick={() => setCurrentStep(2)}>
                        <ChevronLeft className="w-5 h-5 mr-2" /> Previous
                     </Button>
                     <Button className="h-12 px-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-sm" onClick={() => setCurrentStep(4)}>
                        Next <ChevronRight className="w-5 h-5 ml-2" />
                     </Button>
                  </div>
               </div>
            )}

            {/* Step 4: Facility */}
            {currentStep === 4 && (
               <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <InputWithIcon label="Facility/Court Name" required value={formData.facilityName} onChange={(e: any) => updateForm('facilityName', e.target.value)} />
                     {/* <CustomSelect label="Club Type" required value={formData.clubType} onChange={(e: any) => updateForm('clubType', e.target.value)} options={['2v2', '5v5', '7v7', '11v11']} /> */}
                     <CustomSelect label="Club Status" required value={formData.clubStatus} onChange={(e: any) => updateForm('clubStatus', e.target.value)} options={['Active', 'Under Maintenance', 'Opening Soon']} />

                     <CustomSelect label="Types of Courts" required value={formData.courtType} onChange={(e: any) => updateForm('courtType', e.target.value)} options={['Indoor', 'Outdoor', 'Both']} />
                     <InputWithIcon label="Court Number" required type="number" value={formData.courtNumber} onChange={(e: any) => updateForm('courtNumber', e.target.value)} />
                     <CustomSelect label="Sports" required value={formData.sports} onChange={(e: any) => updateForm('sports', e.target.value)} options={['Football', 'Basketball', 'Tennis']} />
                  </div>

                  <div className="bg-[#f0f7ff] border border-[#e0f0ff] p-5 rounded-xl mb-12 flex items-center text-sm font-medium text-[#1e4e8c]">
                     <span className="font-bold mr-2 text-[#0066cc]">Note:</span> This information helps us categorize your facility correctly and provide better service to your customers.
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                     <Button variant="outline" className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50" onClick={() => setCurrentStep(3)}>
                        <ChevronLeft className="w-5 h-5 mr-2" /> Previous
                     </Button>
                     <Button className="h-12 px-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-sm" onClick={() => setCurrentStep(5)}>
                        Next <ChevronRight className="w-5 h-5 ml-2" />
                     </Button>
                  </div>
               </div>
            )}

            {/* Step 5: Terms & Conditions (Review) */}
            {currentStep === 5 && (
               <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="bg-[#f8faff] rounded-2xl p-8 border border-[#e6efff] mb-8">
                     <h3 className="font-bold text-slate-900 mb-6 text-lg">Summary</h3>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <div>
                           <h4 className="font-bold text-slate-700 mb-4 text-sm pb-2 border-b border-slate-200">Basic Information</h4>
                           <div className="space-y-4">
                              <div className="flex justify-between text-sm"><span className="text-slate-500">Club Name:</span><span className="font-bold text-slate-900 text-right">{formData.clubName}</span></div>
                              <div className="flex justify-between text-sm"><span className="text-slate-500">Email:</span><span className="font-bold text-slate-900 text-right">{formData.email}</span></div>
                              <div className="flex justify-between text-sm"><span className="text-slate-500">Phone:</span><span className="font-bold text-slate-900 text-right">{formData.phone}</span></div>
                              <div className="flex justify-between text-sm"><span className="text-slate-500">Website:</span><span className="font-bold text-slate-900 text-right">{formData.website}</span></div>
                           </div>

                           <h4 className="font-bold text-slate-700 mb-4 mt-10 text-sm pb-2 border-b border-slate-200">Facility Details</h4>
                           <div className="space-y-4">
                              <div className="flex justify-between text-sm"><span className="text-slate-500">Facility Name:</span><span className="font-bold text-slate-900 text-right">{formData.facilityName}</span></div>
                              <div className="flex justify-between text-sm"><span className="text-slate-500">Club Type:</span><span className="font-bold text-slate-900 text-right">{formData.clubType}</span></div>
                              <div className="flex justify-between text-sm"><span className="text-slate-500">Status:</span><span className="font-bold text-slate-900 text-right">{formData.clubStatus}</span></div>
                              <div className="flex justify-between text-sm"><span className="text-slate-500">Sports:</span><span className="font-bold text-slate-900 text-right">{formData.sports}</span></div>
                           </div>
                        </div>

                        <div>
                           <h4 className="font-bold text-slate-700 mb-4 text-sm pb-2 border-b border-slate-200">Location</h4>
                           <div className="space-y-4">
                              <div className="flex justify-between text-sm"><span className="text-slate-500">Country:</span><span className="font-bold text-slate-900 text-right">{formData.country}</span></div>
                              <div className="flex justify-between text-sm"><span className="text-slate-500">City:</span><span className="font-bold text-slate-900 text-right">{formData.city}</span></div>
                              <div className="flex justify-between text-sm"><span className="text-slate-500">State:</span><span className="font-bold text-slate-900 text-right">{formData.state}</span></div>
                              <div className="flex justify-between text-sm"><span className="text-slate-500 flex-shrink-0">Address:</span><span className="font-bold text-slate-900 text-right text-balance pl-6 leading-relaxed">{formData.street}</span></div>
                           </div>

                           <h4 className="font-bold text-slate-700 mb-4 mt-10 text-sm pb-2 border-b border-slate-200">Courts</h4>
                           <div className="space-y-4">
                              <div className="flex justify-between text-sm"><span className="text-slate-500">Court Type:</span><span className="font-bold text-slate-900 text-right">{formData.courtType}</span></div>
                              <div className="flex justify-between text-sm"><span className="text-slate-500">Number of Courts:</span><span className="font-bold text-slate-900 text-right">{formData.courtNumber}</span></div>
                              <div className="flex justify-between text-sm"><span className="text-slate-500">GPS Location:</span><span className="font-bold text-slate-900 text-right">40.7128, -74.0060</span></div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-start bg-white border border-slate-200 rounded-2xl p-6 mb-6 hover:border-emerald-300 transition-colors cursor-pointer" onClick={() => setAgreed(!agreed)}>
                     <div className={cn(
                        "w-6 h-6 rounded border flex items-center justify-center mr-4 mt-0.5 shrink-0 transition-colors",
                        agreed ? "bg-emerald-500 border-emerald-500" : "border-slate-300 bg-slate-50"
                     )}>
                        {agreed && <Check className="w-4 h-4 text-white" />}
                     </div>
                     <p className="text-[15px] text-slate-700 font-medium leading-relaxed">
                        I agree to the <span className="text-emerald-600 font-bold hover:underline">Terms and Conditions</span> and <span className="text-emerald-600 font-bold hover:underline">Privacy Policy</span>. I confirm that all the information provided is accurate and I have the authority to manage the mentioned facility.
                     </p>
                  </div>

                  <div className="bg-[#f0fdf6] border border-[#dcfce7] rounded-xl p-5 mb-10 text-[15px] text-[#166534] font-medium">
                     <span className="font-bold text-[#15803d] mr-2">Next Steps:</span> After submission, our team will verify your club information. You'll receive an email confirmation within 24-48 hours.
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                     <Button variant="outline" className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50" onClick={() => setCurrentStep(4)}>
                        <ChevronLeft className="w-5 h-5 mr-2" /> Previous
                     </Button>
                     <Button
                        className="h-12 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!agreed}
                        onClick={handleSubmit}
                     >
                        <Check className="w-5 h-5 mr-2" /> Submit for Verification
                     </Button>
                  </div>
               </div>
            )}
         </div>

         {/* Success Modal */}
         {showSuccessModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-[24px] p-10 max-w-[480px] w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border-[6px] border-emerald-100 flex items-center justify-center mx-auto mb-6">
                     <Check className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-[26px] font-bold text-slate-900 text-center mb-3">Application Submitted!</h2>
                  <p className="text-slate-500 text-center text-[15px] leading-relaxed mb-8">
                     Thank you for applying to become a Court Manager. Your application has been submitted successfully and is now under review by our admin team.
                  </p>

                  <div className="bg-[#f0fdf6] rounded-2xl p-6 mb-10 border border-[#dcfce7]">
                     <h4 className="font-bold text-[#15803d] mb-4">What's Next?</h4>
                     <ul className="space-y-3">
                        <li className="flex items-start text-sm text-[#166534] font-medium leading-tight">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 mr-3 shrink-0" />
                           Admin will review your application
                        </li>
                        <li className="flex items-start text-sm text-[#166534] font-medium leading-tight">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 mr-3 shrink-0" />
                           You'll receive an email notification
                        </li>
                        <li className="flex items-start text-sm text-[#166534] font-medium leading-tight">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 mr-3 shrink-0" />
                           Approval typically takes 1-3 business days
                        </li>
                     </ul>
                  </div>

                  <Link href="/dashboard" className="w-full block">
                     <Button className="w-full h-14 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-md">
                        Back to Login
                     </Button>
                  </Link>
               </div>
            </div>
         )}
      </div>
   );
}
