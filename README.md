# Smart Car ES — React/TypeScript

Веб-порт прототипа экспертной системы **«Умный автомобиль»**, оригинал
которого реализован на Python + tkinter (см. `../smart_car.py`). Логика
вывода, база фактов и правил полностью совпадают с
[bazy_fayl_5.md](../bazy_fayl_5.md).

## Стек

- React 18 + TypeScript
- Vite 5
- CSS Modules

## Локальный запуск

```bash
npm ci
npm run dev
```

Откроется `http://localhost:5173`.

## Сборка

```bash
npm run build
npm run preview
```

Результат — в каталоге `dist/`.

## Деплой на GitHub Pages

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
автоматически собирает и публикует приложение на ветке `gh-pages`/Pages
artifact при каждом `push` в `main`.

В репозитории нужно один раз включить:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

В `vite.config.ts` поле `base` зафиксировано как `/smart-car-es/` — при
смене имени репозитория не забыть обновить.
