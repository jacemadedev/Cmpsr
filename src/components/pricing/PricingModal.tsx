import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { PaymentForm } from '../PaymentForm';
import type { PricingPlan } from '@/lib/types';
import { pricingPlans } from '@/lib/pricing';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: PricingPlan;
}

export function PricingModal({ isOpen, onClose, selectedPlan: initialPlan }: PricingModalProps) {
  // Use the passed plan or default to the basic plan
  const selectedPlan = initialPlan || pricingPlans.find(p => p.id === 'basic') || null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-900">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Upgrade to {selectedPlan?.name || 'Premium'}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedPlan?.description || 'Get access to advanced features and higher usage limits.'}
                  </p>
                </div>

                <div className="mt-4">
                  <PaymentForm selectedPlan={selectedPlan} />
                </div>

                <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                  Secure payment powered by Stripe
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}