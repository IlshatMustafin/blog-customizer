import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { clsx } from 'clsx';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import {
	ArticleStateType,
	defaultArticleState,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type TArticleParamsFormProps = {
	currentAppState: ArticleStateType;
	onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	currentAppState,
	onApply,
}: TArticleParamsFormProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const sidebarRef = useRef<HTMLDivElement | null>(null);
	const [formState, setFormState] = useState<ArticleStateType>(currentAppState);

	useEffect(() => {
		setFormState(currentAppState);
	}, [currentAppState]);
	// Иверсия состояния меню по стрелке
	const handleToggle = () => {
		setIsSidebarOpen((prev) => !prev);
	};

	// Закрытие по клику вне области сайдбара
	useEffect(() => {
		if (!isSidebarOpen) return;
		const handleOutsideClick = (event: MouseEvent) => {
			const target = event.target as Node;
			if (sidebarRef.current && sidebarRef.current.contains(target)) return;
			if ((target as HTMLElement).closest('[role="button"]')) return;
			setIsSidebarOpen(false);
		};
		window.addEventListener('mousedown', handleOutsideClick);
		return () => window.removeEventListener('mousedown', handleOutsideClick);
	}, [isSidebarOpen]);

	// Вспомогательная функция для обновления отдельных полей в стейте формы
	const handleFieldChange = <K extends keyof ArticleStateType>(
		key: K,
		value: ArticleStateType[K]
	) => {
		setFormState((prev) => ({ ...prev, [key]: value }));
	};

	// Кнопка «Применить»
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onApply(formState);
	};

	// Кнопка «Сбросить» и сразу применить
	const handleReset = () => {
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
	};

	return (
		<>
			<ArrowButton isOpen={isSidebarOpen} onClick={handleToggle} />
			<aside
				ref={sidebarRef}
				className={clsx(styles.container, {
					[styles.container_open]: isSidebarOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					{/* 1. Заголовок формы */}
					<Text size={31} weight={800} uppercase family='open-sans'>
						Задайте параметры
					</Text>

					<div className={styles.fieldsContainer}>
						{/* 2. Селект выбора Шрифта */}
						<Select
							title='Шрифт'
							options={fontFamilyOptions}
							selected={formState.fontFamilyOption}
							onChange={(val) => handleFieldChange('fontFamilyOption', val)}
						/>

						{/* 3. Радио-группа для выбора Размера шрифта */}
						<RadioGroup
							title='Размер шрифта'
							name='fontSize'
							options={fontSizeOptions}
							selected={formState.fontSizeOption}
							onChange={(val) => handleFieldChange('fontSizeOption', val)}
						/>

						{/* 4. Селект выбора Цвета шрифта */}
						<Select
							title='Цвет шрифта'
							options={fontColors}
							selected={formState.fontColor}
							onChange={(val) => handleFieldChange('fontColor', val)}
						/>

						{/* 5. Разделительная линия */}
						<Separator />

						{/* 6. Селект выбора Цвета фона */}
						<Select
							title='Цвет фона'
							options={backgroundColors}
							selected={formState.backgroundColor}
							onChange={(val) => handleFieldChange('backgroundColor', val)}
						/>

						{/* 7. Селект выбора Ширины контента */}
						<Select
							title='Ширина контента'
							options={contentWidthArr}
							selected={formState.contentWidth}
							onChange={(val) => handleFieldChange('contentWidth', val)}
						/>
					</div>

					{/* Блок с кнопками управления */}
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
