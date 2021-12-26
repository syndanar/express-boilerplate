import {Request, Response} from 'express';
import * as taskListGet from '@/routes/task/list-get';
import {ITask, TaskModel} from '@/models/task';
import {Session} from '@/session';

/**
 * Account controller
 */
class TaskController {
  /**
   * Получить список задач
   * @param {e.Request} req
   * @param {e.Response} res
   * @return {Promise<taskListGet.Status | ITask>}
   */
  async list(req: Request, res: Response): Promise<taskListGet.Status | ITask[]> {
    return new Promise((resolve, reject) => {
      TaskModel.find({
        $or: [
          {
            owner: Session.getAccount(),
          },
          {
            assign: Session.getAccount(),
          },
          {
            viewers: Session.getAccount(),
          },
        ],
      }).then((result) => {
        resolve(result);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  /**
   * Создать новую задачу
   * @param {e.Request} req
   * @param {e.Response} res
   * @return {Promise<ITask>}
   */
  async create(req: Request, res: Response): Promise<ITask> {
    return new Promise(((resolve) => {
      const newTask = new TaskModel();
      newTask.description = req.body.description;
      newTask.title = req.body.title;
      newTask.owner = Session.getAccount().get('id');
      newTask.save().then((task) => {
        resolve(task);
      });
    }));
  }

  /**
   * Удалить задачу
   * @param {e.Request} req
   * @param {e.Response} res
   * @return {Promise<void>}
   */
  async delete(req: Request, res: Response): Promise<void> {
    return new Promise(((resolve, reject) => {
      if (!req.body._id) {
        reject(new Error('Task _id required'));
      }
      const query = TaskModel.findByIdAndRemove(req.body._id, {}, ((err) => {
        if (err) {
          reject(err);
        }
      }));
    }));
  }
}
export default TaskController;
