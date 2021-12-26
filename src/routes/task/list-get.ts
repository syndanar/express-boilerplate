import {NextFunction, Request, Response} from 'express';
import TaskController from '@controllers/task';
import {OperationObject} from '@/types/swagger';

export enum Status {
  SUCCESS,
  BAD_REQUEST
}

export const swagger: OperationObject = {
  'summary': 'Список задач',
  'description': 'Получить список задач пользователя',
  'tags': ['task'],
  'responses': {
    '200': {
      'description': 'Возвращает список задач пользователя',
      'content': {
        'application/json': {
          'schema': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                '_id': {
                  type: 'string',
                },
                'title': {
                  type: 'string',
                },
                'description': {
                  type: 'string',
                },
                'owner': {
                  type: 'string',
                },
                'assign': {
                  type: 'string',
                },
                'viewers': {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    '400': {
      'description': 'Bad request',
    },
  },
};

export const handler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
  const controller = new TaskController();
  const result = await controller.list(req, res);
  if (typeof result === 'object') {
    res.status(200);
    res.json(result);
  } else {
    switch (result) {
      case Status.BAD_REQUEST:
        res.status(400);
        res.send('Bad request');
        break;
    }
  }
  next();
};
