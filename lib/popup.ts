import Swal from 'sweetalert2';

export async function showSuccessPopup(title: string, text: string) {
  await Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'המשך',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-2xl',
      title: 'text-gray-900',
      htmlContainer: 'text-gray-600',
      confirmButton:
        'inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition-all cursor-pointer',
    },
  });
}
