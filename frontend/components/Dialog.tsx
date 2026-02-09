'use client';

import { Fragment, useRef } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
}

export default function Dialog({
  open,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default'
}: DialogProps) {
  const cancelButtonRef = useRef(null);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <HeadlessDialog 
        as="div" 
        className="relative z-50" 
        initialFocus={cancelButtonRef} 
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <HeadlessDialog.Panel className="relative transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 px-6 pb-6 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-8">
                <div className="sm:flex sm:items-start">
                  <div className={`${
                    variant === 'danger' 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : 'bg-purple-500/10 border-purple-500/30'
                  } mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border sm:mx-0 sm:h-10 sm:w-10`}>
                    {variant === 'danger' ? (
                      <svg 
                        className="h-6 w-6 text-red-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth="1.5" 
                        stroke="currentColor" 
                        aria-hidden="true"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
                        />
                      </svg>
                    ) : (
                      <svg 
                        className="h-6 w-6 text-purple-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth="1.5" 
                        stroke="currentColor" 
                        aria-hidden="true"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" 
                        />
                      </svg>
                    )}
                  </div>
                  <div className="mt-4 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <HeadlessDialog.Title 
                      as="h3" 
                      className="text-lg font-semibold leading-6 text-white"
                    >
                      {title}
                    </HeadlessDialog.Title>
                    <div className="mt-3">
                      <p className="text-gray-400">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex flex-col-reverse gap-3 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-xl bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 hover:bg-gray-700/50 sm:col-start-1 sm:mt-0 transition-all duration-300"
                    onClick={onClose}
                    ref={cancelButtonRef}
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2 transition-all duration-300 ${
                      variant === 'danger'
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus-visible:outline-red-500'
                        : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus-visible:outline-purple-500'
                    }`}
                    onClick={handleConfirm}
                  >
                    {confirmText}
                  </button>
                </div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition.Root>
  );
}