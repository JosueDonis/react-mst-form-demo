import * as React from 'react';
import { Component, ChangeEvent, MouseEvent, ReactNode } from 'react';

import { ISchemaProps, ISchemaStates } from './types';
import { ISchemaStyleProps, ISchemaStyles } from './types';

import withStyles from '@material-ui/core/styles/withStyles';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export class Schema extends Component<
  ISchemaProps & ISchemaStyleProps,
  ISchemaStates
> {
  static getDerivedStateFromPropsFix(
    props: Readonly<ISchemaProps & ISchemaStyleProps>,
    state?: ISchemaStates
  ): ISchemaStates {
    const { config } = props;
    return { config: JSON.stringify(config, null, 2) };
  }

  constructor(props: ISchemaProps & ISchemaStyleProps) {
    super(props);
    this.state = Schema.getDerivedStateFromPropsFix(props);
  }

  componentWillReceiveProps(
    nextProps: Readonly<ISchemaProps & ISchemaStyleProps>
  ): void {
    if (this.props.config !== nextProps.config) {
      this.setState(state =>
        Schema.getDerivedStateFromPropsFix(nextProps, state)
      );
    }
  }

  public render(): ReactNode {
    const { className, classes, style } = this.props;
    const { config } = this.state;
    return (
      <div {...{ className, style }}>
        <h1>Schema</h1>
        <Paper square elevation={3} className={classes.paper}>
          <TextField
            multiline
            fullWidth
            rows={25}
            value={config}
            onChange={this.onChange}
          />
        </Paper>
        <Button
          variant={'raised'}
          color={'primary'}
          disabled={!this.isJSON(config)}
          onClick={this.onSubmit}
        >
          Render
        </Button>
      </div>
    );
  }

  private isJSON(config: string): boolean {
    try {
      return JSON.parse(config);
    } catch {
      return false;
    }
  }

  private onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const config = event.currentTarget.value;
    this.setState(() => ({ config }));
  };

  private onSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    const { config } = this.state;
    const { onConfig } = this.props;
    if (onConfig) {
      onConfig(JSON.parse(config));
    }
  };
}

export default withStyles<keyof ISchemaStyles, {}>({
  paper: {}
})(Schema);
