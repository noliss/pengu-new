import { useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import cn from 'classnames';
import { CardSlider, ColorPicker } from '@shared/ui';
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
import { GenerateActions } from '@features/generate-character';
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
 * Нижний стеклянный док со всеми контролами генерации.
 * Располагается над BottomNav; тянуть за handle или тапать по нему — сворачивает/разворачивает
 * дополнительные ряды, оставляя только actions, чтобы освободить превью.
 */
export const GenerateDock = ({ onGenerate }: GenerateDockProps) => {
  const dispatch = useAppDispatch();
  const selections = useAppSelector(selectCharacterSelections);
  const activePartId = useAppSelector(selectActivePartId);
  const [collapsed, setCollapsed] = useState(false);

  const activeSelection = activePartId ? selections[activePartId] : undefined;
  const selectedSvgId = activeSelection?.svgId ?? null;
  const selectedColor = activeSelection?.color ?? undefined;

  const partIds = useMemo(() => MOCK_CHARACTER_PARTS.map((p) => p.id), []);
  const svgIds = useMemo(() => svgItems.map((s) => s.id), []);

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
          color: selectedColor ?? null,
        }),
      );
    },
    [dispatch, activePartId, selectedColor],
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      if (!activePartId) return;
      dispatch(
        setPartSelection({
          partId: activePartId,
          svgId: selectedSvgId,
          color,
        }),
      );
    },
    [dispatch, activePartId, selectedSvgId],
  );

  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);

  return (
    <Box
      className={cn(styles.dock, { [styles.collapsed]: collapsed })}
      role="region"
      aria-label="Панель генерации персонажа"
    >
      <Box className={styles.handleRow}>
        <Box
          className={styles.handle}
          role="button"
          tabIndex={0}
          aria-label={collapsed ? 'Развернуть панель' : 'Свернуть панель'}
          aria-expanded={!collapsed}
          onClick={toggleCollapsed}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleCollapsed();
            }
          }}
        />
        <IconButton
          size="small"
          className={cn(styles.collapseButton, { [styles.collapsedIcon]: collapsed })}
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Развернуть панель' : 'Свернуть панель'}
        >
          <KeyboardArrowDownIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box className={styles.collapsible} aria-hidden={collapsed}>
        <CardSlider
          items={MOCK_CHARACTER_PARTS}
          selectedId={activePartId}
          onSelect={handlePartSelect}
          itemVariant="text"
          renderItem={(item) => item.label}
        />

        <Box className={styles.row}>
          <Box className={styles.svgCol}>
            <CardSlider
              items={svgItems}
              selectedId={selectedSvgId}
              onSelect={handleSvgSelect}
              itemVariant="image"
              renderItem={(item) => <img src={item.src} alt={`SVG ${item.id}`} />}
            />
          </Box>
          <Box className={styles.colorCol}>
            <ColorPicker selectedColor={selectedColor} onColorSelect={handleColorSelect} />
          </Box>
        </Box>
      </Box>

      <GenerateActions
        partIds={partIds}
        svgIds={svgIds}
        colors={DEFAULT_COLORS}
        onGenerate={onGenerate}
      />
    </Box>
  );
};
