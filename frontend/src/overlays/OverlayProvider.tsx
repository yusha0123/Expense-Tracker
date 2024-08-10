import DeleteDialog from "./DeleteDialog";
import DownloadModal from "./DownloadModal";
import ResetPasswordModal from "./ResetPasswordModal";
import SideDrawer from "./SideDrawer";

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
