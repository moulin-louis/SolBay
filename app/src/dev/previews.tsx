import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import {CreateAuction} from "../CreateAuction/CreateAuction.tsx";

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree/>}>
      <ComponentPreview path="/CreateAuction">
        <CreateAuction/>
      </ComponentPreview>
    </Previews>
  );
};

export default ComponentPreviews;