import DeleteDialog from "@/overlays/DeleteDialog";
import DownloadModal from "@/overlays/DownloadModal";
import EditExpenseDialog from "@/overlays/EditExpenseDialog";
import ResetPasswordModal from "@/overlays/ResetPasswordModal";
import SideDrawer from "@/overlays/SideDrawer";

const OverlayProvider = () => {
  return (
    <>
      <DownloadModal />
      <ResetPasswordModal />
      <SideDrawer />
      <EditExpenseDialog />
      <DeleteDialog />
    </>
  );
};

export default OverlayProvider;
