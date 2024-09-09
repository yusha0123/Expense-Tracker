import DeleteDialog from "@/overlays/DeleteDialog";
import DownloadModal from "@/overlays/DownloadModal";
import ResetPasswordModal from "@/overlays/ResetPasswordModal";
import SideDrawer from "@/overlays/SideDrawer";

const OverlayProvider = () => {
  return (
    <>
      <DownloadModal />
      <ResetPasswordModal />
      <SideDrawer />
      <DeleteDialog />
    </>
  );
};

export default OverlayProvider;
