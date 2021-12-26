import {NextFunction, Request, Response} from 'express';
import TaskController from '@controllers/task';
import {OperationObject} from '@/types/swagger';

export enum Status {
  SUCCESS,
  BAD_REQUEST
}

export const swagger: OperationObject = {
  'summary': 'Создать задачу',
  'description': 'Создание задачи для пользователя',
  'tags': ['task'],
  'responses': {
    '201': {
      'description': 'Возвращает список задач пользователя',
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
  const result = await controller.create(req, res);
  if (typeof result === 'object') {
    res.status(201);
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
