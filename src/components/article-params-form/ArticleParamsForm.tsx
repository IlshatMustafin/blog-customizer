import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

import styles from './ArticleParamsForm.module.scss';

export const ArticleParamsForm = () => {
	const [isOpen, setIsOpen] = useState(false);
	// Привяжем реф непосредственно к выезжающей панели aside
	const sidebarRef = useRef<HTMLDivElement | null>(null);

	// Иверсия состояния меню по стрелке
	const handleToggle = () => {
		setIsOpen((prev) => !prev);
	};
	// Закрытие меню по нажатию вне области
	useEffect(() => {
		if (!isOpen) return;

		const handleOutsideClick = (event: MouseEvent) => {
			const target = event.target as Node;
			// Если нажали внутри сайдбара
			if (sidebarRef.current && sidebarRef.current.contains(target)) {
				return;
			}
			// Проверяем клика по самой кнопке-стрелке
			if ((target as HTMLElement).closest('[role="button"]')) {
				return;
			}
			// Иначе закрываем форму
			setIsOpen(false);
		};
		window.addEventListener('mousedown', handleOutsideClick);
		// Удаляем слушатель
		return () => {
			window.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen]);

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={handleToggle} />
			<aside ref={sidebarRef} className={clsx(styles.container, {
				[styles.container_open]: isOpen,
			})}>
				<form className={styles.form}>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
