import { useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { CardSlider } from '@shared/ui';
import { useAppDispatch, useAppSelector } from '@shared/store';
import {
  DEFAULT_COLORS,
  MOCK_CHARACTER_PARTS,
  clearPartSelection,
  selectActivePartId,
  selectCharacterSelections,
  setActivePartId,
  setPartSelection,
} from '@entities/character';
import { ColorPickerButton, GenerateActions } from '@features/generate-character';
import styles from './GenerateDock.module.scss';

const svgModules = import.meta.glob<{ default: string }>('@assets/images/*.svg', { eager: true });

const svgItems = Object.entries(svgModules)
  .map(([path, mod]) => {
    const id = path.split('/').pop()?.replace('.svg', '') ?? path;
    return { id, src: mod.default };
  })
  .sort((a, b) => Number(a.id) - Number(b.id));

interface GenerateDockProps {
  onGenerate?: () => void;
}

/**
 * Нижний док: chips с частями, inline-редактор (SVG + цвет) и панель действий.
 * Редактор плавно "выдвигается" между превью персонажа и рядом частей, когда
 * пользователь выбирает часть тела, — пингвин и контролы всегда остаются видимы.
 */
export const GenerateDock = ({ onGenerate }: GenerateDockProps) => {
  const dispatch = useAppDispatch();
  const activePartId = useAppSelector(selectActivePartId);
  const selections = useAppSelector(selectCharacterSelections);
  const [editorOpen, setEditorOpen] = useState(false);

  const partIds = useMemo(() => MOCK_CHARACTER_PARTS.map((p) => p.id), []);
  const svgIds = useMemo(() => svgItems.map((s) => s.id), []);

  const activeSelection = activePartId ? selections[activePartId] : undefined;
  const selectedSvgId = activeSelection?.svgId ?? null;
  const selectedColor = activeSelection?.color ?? null;

  const handlePartSelect = useCallback(
    (id: string | null) => {
      // Повторный тап по активной части (CardSlider присылает null) — схлопываем редактор.
      if (id === null) {
        setEditorOpen(false);
        return;
      }
      dispatch(setActivePartId(id));
      setEditorOpen(true);
    },
    [dispatch],
  );

  const handleSvgSelect = useCallback(
    (svgId: string | null) => {
      if (!activePartId) return;
      if (svgId === null) {
        dispatch(clearPartSelection(activePartId));
        return;
      }
      dispatch(
        setPartSelection({ partId: activePartId, svgId, color: selectedColor ?? null }),
      );
    },
    [dispatch, activePartId, selectedColor],
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      if (!activePartId) return;
      dispatch(setPartSelection({ partId: activePartId, svgId: selectedSvgId, color }));
    },
    [dispatch, activePartId, selectedSvgId],
  );

  const editorVisible = editorOpen && Boolean(activePartId);

  return (
    <Box className={styles.dock} role="region" aria-label="Панель генерации персонажа">
      <CardSlider
        items={MOCK_CHARACTER_PARTS}
        selectedId={activePartId}
        onSelect={handlePartSelect}
        itemVariant="text"
        renderItem={(item) => item.label}
      />

      <Collapse in={editorVisible} timeout={260} unmountOnExit>
        <Box className={styles.editor} aria-label="Редактор части персонажа">
          <Box className={styles.editorRow}>
            <Box className={styles.editorSlider}>
              <CardSlider
                items={svgItems}
                selectedId={selectedSvgId}
                onSelect={handleSvgSelect}
                itemVariant="image"
                renderItem={(item) => <img src={item.src} alt={`SVG ${item.id}`} />}
              />
            </Box>
            <ColorPickerButton
              colors={DEFAULT_COLORS}
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
            />
          </Box>
        </Box>
      </Collapse>

      <GenerateActions
        partIds={partIds}
        svgIds={svgIds}
        colors={DEFAULT_COLORS}
        onGenerate={onGenerate}
      />
    </Box>
  );
};
