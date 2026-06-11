import className from 'classnames';
import { GoX } from "react-icons/go";
import { useEffect } from 'react';

interface ModalProps {
    show: boolean;
    modalTitle: string;
    setShow: (show: boolean) => void;
    formSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    modalFooter: React.ReactNode;
    children: React.ReactNode;
}

export default function Modal({ show, modalTitle, setShow, formSubmit, modalFooter, children }: ModalProps) {
    useEffect(() => {
        document.body.style.overflow = show ? 'hidden' : 'initial';
    }, [show]);

    const classes = className(
        'overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full',
        {
            'flex': show,
            'hidden': !show,
        }
    );

    const backgroundClasses = className(
        'fixed top-0 right-0 left-0 bottom-0 z-49 w-full h-full bg-black opacity-65',
        {
            'flex': show,
            'hidden': !show,
        }
    );

    return (
        <>
            <div className={backgroundClasses}></div>
            <div id="default-modal" className={classes}>
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 max-h-[90dvh] flex flex-col">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200 w-full">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {modalTitle}
                            </h3>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal" onClick={() => setShow(false)}>
                                <GoX />
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        {formSubmit ? (
                            <form onSubmit={formSubmit} className='w-full grow shrink overflow-auto'>
                                <div className="p-4 md:p-5 space-y-4 w-full overflow-auto">
                                    {children}
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="p-4 md:p-5 space-y-4 w-full overflow-auto">
                                    {children}
                                </div>
                            </>
                        )}

                        <div className="p-4 md:p-5 space-y-4 w-full">
                            {modalFooter}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}