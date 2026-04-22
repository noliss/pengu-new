import { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Layout } from "../../components/Layout";
import { TextSlider } from "../../components/TextSlider";
import { SvgSlider } from "../../components/SvgSlider";
import { ColorPicker } from "../../components/ColorPicker";
import { LottieAnimation } from "../../components/LottieAnimation";
import { GenerateActions } from "../../components/GenerateActions";
import penguAnimation from "../../assets/lottie/pengu.json";
import svg1 from "../../assets/images/1.svg";
import svg2 from "../../assets/images/2.svg";
import svg3 from "../../assets/images/3.svg";
import svg4 from "../../assets/images/4.svg";
import svg5 from "../../assets/images/5.svg";
import svg6 from "../../assets/images/6.svg";
import svg7 from "../../assets/images/7.svg";
import svg8 from "../../assets/images/8.svg";
import svg9 from "../../assets/images/9.svg";
import svg10 from "../../assets/images/10.svg";

const mockBlocks = [
  { id: "1", text: "Клюв" },
  { id: "2", text: "Крылья" },
  { id: "3", text: "Лапы" },
  { id: "4", text: "Глаза" },
  { id: "5", text: "Хвост" },
  { id: "6", text: "Шея" },
  { id: "7", text: "Голова" },
  { id: "8", text: "Туловище" },
];

const svgItems = [
  { id: "1", src: svg1 },
  { id: "2", src: svg2 },
  { id: "3", src: svg3 },
  { id: "4", src: svg4 },
  { id: "5", src: svg5 },
  { id: "6", src: svg6 },
  { id: "7", src: svg7 },
  { id: "8", src: svg8 },
  { id: "9", src: svg9 },
  { id: "10", src: svg10 },
];

export const Generate = () => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ padding: "15px 15px", paddingBottom: "80px" }}>
        {/* <PageHeader title="Generate" /> */}

        <TextSlider blocks={mockBlocks} />
        
        <Box
          sx={{
            marginTop: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0, paddingRight: "4px" }}>
            <SvgSlider items={svgItems} />
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <ColorPicker 
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
          </Box>
        </Box>

        <Box>
          <LottieAnimation 
            animationData={penguAnimation}
            loop={true}
            autoplay={true}
          />
        </Box>
      </Container>

      <GenerateActions
        onUndo={() => console.log('Undo')}
        onRandom={() => console.log('Random')}
        onReset={() => console.log('Reset')}
        onSettings={() => console.log('Settings')}
        onGenerate={() => console.log('Generate')}
      />
    </Layout>
  );
};
