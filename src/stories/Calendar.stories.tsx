import * as React from "react";
import { format } from "date-fns";
import { ru } from "react-day-picker/locale";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RU_LOCALE = "ru-RU";
const CALENDAR_START_MONTH = new Date(1990, 0);
const CALENDAR_END_MONTH = new Date(2035, 11);

const formatMonthDropdownRu = (date: Date) =>
  date.toLocaleString(RU_LOCALE, { month: "long" });

const formatSelectedDate = (date?: Date) =>
  date ? format(date, "d MMMM yyyy", { locale: ru }) : "дата не выбрана";

function CalendarDemo() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date(),
  );

  return (
    <Card className="mx-auto w-full max-w-3xl rounded-2xl">
      <CardHeader>
        <CardTitle>Интерактивный календарь</CardTitle>
        <CardDescription>
          Выбирайте дату, месяц и год во встроенных выпадающих списках
          календаря.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full overflow-x-auto rounded-xl border bg-muted/20 p-3">
          <div className="mx-auto min-w-[280px] max-w-full">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ru}
              captionLayout="dropdown"
              navLayout="after"
              startMonth={CALENDAR_START_MONTH}
              endMonth={CALENDAR_END_MONTH}
              className="mx-auto rounded-lg border bg-background"
              formatters={{ formatMonthDropdown: formatMonthDropdownRu }}
            />
          </div>
        </div>

        <p className="rounded-md border bg-background px-3 py-2 text-sm">
          Выбранная дата:{" "}
          <span className="font-medium">{formatSelectedDate(selectedDate)}</span>
        </p>
      </CardContent>
    </Card>
  );
}

const meta: Meta<typeof CalendarDemo> = {
  title: "Компоненты/Календарь",
  component: CalendarDemo,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Интерактивно",
  render: () => <CalendarDemo />,
};
