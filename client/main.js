import toastr from 'toastr'
import 'toastr/build/toastr.css'

toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: 'toast-top-left',
    preventDuplicates: true,
    onclick: null,
    showDuration: '300',
    hideDuration: '500',
    timeOut: '2000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut'
}
