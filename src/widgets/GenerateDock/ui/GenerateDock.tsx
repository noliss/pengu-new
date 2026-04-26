import { useCallback, useEffect, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import cn from 'classnames';
import { CardSlider } from '@shared/ui';
import { useAppDispatch, useAppSelector } from '@shared/store';
import {
  DEFAULT_COLORS,
  type CharacterPart,
  MOCK_CHARACTER_PARTS,
  clearPartSelection,
  selectActivePartId,
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

type SvgItem = (typeof svgItems)[number];

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
  const activeSelection = useAppSelector((state) =>
    activePartId ? state.character.draft.selections[activePartId] : undefined,
  );

  const partIds = useMemo(() => MOCK_CHARACTER_PARTS.map((p) => p.id), []);
  const svgIds = useMemo(() => svgItems.map((s) => s.id), []);

  const selectedSvgId = activeSelection?.svgId ?? null;
  const selectedColor = activeSelection?.color ?? null;
  const selectedColorRef = useRef(selectedColor);

  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  // Видимость редактора — чистое производное от activePartId в сторе.
  // Любое программное изменение активной части (выбор chip'а, Random, undo,
  // восстановление из persist) автоматически синхронизируется с UI.
  const editorVisible = Boolean(activePartId);

  const handlePartSelect = useCallback(
    (id: string | null) => {
      dispatch(setActivePartId(id));
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
        setPartSelection({
          partId: activePartId,
          svgId,
          color: selectedColorRef.current ?? null,
        }),
      );
    },
    [dispatch, activePartId],
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      if (!activePartId) return;
      dispatch(setPartSelection({ partId: activePartId, svgId: selectedSvgId, color }));
    },
    [dispatch, activePartId, selectedSvgId],
  );

  const renderPartItem = useCallback((item: CharacterPart) => item.label, []);

  const renderSvgItem = useCallback(
    (item: SvgItem) => (
      <img
        src={item.src}
        alt={`SVG ${item.id}`}
        loading="eager"
        decoding="async"
        draggable={false}
      />
    ),
    [],
  );

  return (
    <Box className={styles.dock} role="region" aria-label="Панель генерации персонажа">
      <CardSlider
        items={MOCK_CHARACTER_PARTS}
        selectedId={activePartId}
        onSelect={handlePartSelect}
        itemVariant="text"
        renderItem={renderPartItem}
      />

      <Box
        className={cn(styles.editorShell, {
          [styles.editorShellVisible]: editorVisible,
        })}
        aria-hidden={!editorVisible}
      >
        <Box className={styles.editorClip}>
          <Box className={styles.editor} aria-label="Редактор части персонажа">
            <Box className={styles.editorRow}>
              <Box className={styles.editorSlider}>
                <CardSlider
                  items={svgItems}
                  selectedId={selectedSvgId}
                  onSelect={handleSvgSelect}
                  itemVariant="image"
                  renderItem={renderSvgItem}
                />
              </Box>
              <ColorPickerButton
                colors={DEFAULT_COLORS}
                selectedColor={selectedColor}
                onColorSelect={handleColorSelect}
                disabled={!editorVisible}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className={styles.actions}>
        <GenerateActions
          partIds={partIds}
          svgIds={svgIds}
          colors={DEFAULT_COLORS}
          onGenerate={onGenerate}
        />
      </Box>
    </Box>
  );
};
