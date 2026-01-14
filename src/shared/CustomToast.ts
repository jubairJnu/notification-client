import Swal from "sweetalert2";

export const showToast = (
  title: string,
  icon: "error" | "success" | "warning"
) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    title,
    icon,
  });
};

export const successToast = (title?: string) => {
  showToast(title ? title : "Added Successfully", "success");
};
export const errorToast = (error: any) => {
  showToast(`${error?.data?.message} || something went wrong`, "error");
};
