## Правила формирования маршрутов

* Директория и имя файла определяют путь для endpoint обрабатываемого запроса
* Endpoint содержит префикс /api
* Имя файла также определяет обрабатываемый HTTP метод

#### Пример наименования файла маршрута:

/routes/path/to/file-get.ts будет обрабатывать GET запрос по адресу /api/path/to/file
/routes/another-post.ts будет обрабатывать POST запрос по адресу /api/another


#### Содержимое файла маршрута:

```typescript
import {Request, Response, NextFunction} from 'express'
import {JsonObject} from 'swagger-ui-express'
import Joi from 'joi'

/**
 * Объект валидации тела запроса, подробнее:
 * https://joi.dev/api/
 * 
 * Если запрос не содержит тело запроса, тогда экспорт схемы не требуется
 */
export const schema: Joi.ObjectSchema = {}

/** 
 * Объект описания маршрута, подробнее:
 * https://swagger.io/specification/#operation-object
 */
export const swagger: JsonObject = {}

/** Функция обработки вызова маршрута */
export const handler = async (req: Request, res: Response, next: NextFunction) => {}
```
