const bookOfStyle = {
  
    purchaseTitle: ['text-lg', 'font-medium', 'text-gray-900', 'flex-1'],
    purchaseQuantity: [
        'w-[100px]',
        'text-center',
        'py-1',
        'px-1',
        'border',
        'border-pink-700',
        'border-2',
        'disabled:border-0',
        'rounded',
        'text-pink-700',
        'text-sm',
        'leading-tight',
        'font-bold',
        'disabled:text-gray-700',
        'focus:outline-none',
        'focus::shadow-outline',
    ],
    purchaseQuantityWrapper: ['flex', 'flex-row', 'flex-1','justify-start'],
    purchaseType: [
        'w-fit',
        'py-1',
        'px-2',
        'border',
        'border-orange-700',
        'border-2',
        'py-px',
        'disabled:border-transparent',
        'disabled:text-gray-900',
        'disabled:border-2',
        'disabled:pl-3',
        'rounded',
        'leading-tight',
        'focus:outline-none',
        'focus:shadow-outline',
        'text-sm',
        'font-bold',
        'text-orange-700',
        'flex-1',
    ],
    purchaseTypeWrapper: ['flex', 'flex-row', 'flex-1','justify-start'],
    purchaseDate: ['text-center', 'flex-1', 'hidden', 'md:flex'],
    purchasePrice: ['text-center', 'flex-1', 'hidden', 'md:flex'],
    actions: ['sm:mt-0', 'sm:text-right', 'w-28'],
    actionButton: [
        'ml-2',
        'text-xl',
        'ps-2',
        'font-medium',
        'underline',
        'text-gray-700'
    ],
    deleteButton: ['hover:text-red-500','mr-2'],
    cancelButton: ['hover:text-red-500','mr-2'],
    saveButton: ['hover:text-green-500','mr-2'],
    editButton: ['hover:text-blue-500','mr-2'],
    hiddenButton: ['hidden'],
    eventWrapper: [
        'event',
        'big-white',
        'rounded',
        'shadow-md',
        'p-4',
        'flex',
        'flex-col',
        'm-6',
    ],
    actionsWrapper: ['actions', 'flex',  'mt-4'],
    quantity: ['actions', 'flex', 'mt-4'],
    input: [
        'input',
        'w-16',
        'text-center',
        'border',
        'border-gray-300',
        'rounded',
        'py-2',
        'px-3',
    ],
    increaseBtn: [
        'increase',
        'px-3',
        'py-1',
        'rounded',
        'add-btn',
        'text-black',
        'hover:bg-ivory',
        'focus:outline-none',
        'focus:shadow-outline',
    ],
    quantityActions: ['quantity-actions', 'flex', 'space-x-2'],
    decreaseBtn: [
        'decrease',
        'px-3',
        'py-1',
        'rounded',
        'add-btn',
        'text-black',
        'hover:bg-ivory',
        'focus:outline-none',
        'focus:shadow-outline',
    ],
    addToCartBtn: [
        'add-to-cart-btn',
        'px-2',
        'py-2',
        'rounded',
        'font-bold',
        'disabled:cursor-not-allowed',
        'focus:outline-none',
        'focus:shadow-outline',
        'animate'
    ]
};
toastr.options = {
    positionClass: 'toast-bottom-right'
  };
export function useStyle(type) {
    if (typeof type === 'string') return bookOfStyle[type];
    else {
        const allStyles = type.map((t) => bookOfStyle[t]);
        return allStyles.flat();
    }

}