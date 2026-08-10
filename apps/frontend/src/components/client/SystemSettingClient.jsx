"use client";

import { useEffect, useState } from "react";
import { Settings, Plus, Building2, Mail } from "lucide-react";
import { useDispatch } from "react-redux";

import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import QuickStats from "@/components/QuickStats";
import ConfirmDialog from "@/components/ConfirmDialog";

import SystemSettingTable from "@/components/tables/SystemSettingTable";
import SystemSettingModal from "@/components/modals/SystemSettingModal";

import {
  useGetAllSystemSettings,
  useCreateSystemSetting,
  useUpdateSystemSetting,
  useGetOneSystemSetting,
} from "@/hooks/useSystemSetting";

import {
  setSystemSetting,
  setSystemSettingLoading,
  setSystemSettingError,
} from "@/store/systemSettingSlice";

export default function SystemSettingClient() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const limit = 10;

  const [openModal, setOpenModal] = useState(false);

  const [editingSetting, setEditingSetting] = useState(null);

  const [dialog, setDialog] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data, isLoading, isFetching, refetch } = useGetAllSystemSettings({
    page,
    limit,
    search,
  });

  const createSetting = useCreateSystemSetting();

  const updateSetting = useUpdateSystemSetting();

  const getOneSetting = useGetOneSystemSetting();

  useEffect(() => {
    dispatch(setSystemSettingLoading(isLoading));
  }, [isLoading]);

  useEffect(() => {
    if (data?.data) {
      dispatch(setSystemSetting(data.data));
    }
  }, [data]);

  const settings = data?.data?.data || [];

  const total = data?.data?.total || 0;

  const handleSubmit = async (payload) => {
    try {
      if (editingSetting) {
        await updateSetting.mutateAsync({
          id: editingSetting.id,
          payload,
        });

        setDialog({
          open: true,
          message: "System Setting Updated Successfully",
        });
      } else {
        await createSetting.mutateAsync(payload);

        setDialog({
          open: true,
          message: "System Setting Created Successfully",
        });
      }

      setOpenModal(false);

      setEditingSetting(null);

      refetch();
    } catch (err) {
      dispatch(setSystemSettingError(err));

      setDialog({
        open: true,
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong.",
      });
    }
  };

  const handleEdit = async (row) => {
    try {
      const res = await getOneSetting.mutateAsync(row.id);

      setEditingSetting(res.data);

      setOpenModal(true);
    } catch {}
  };

  return (
    <div className="space-y-8">
      <Header
        title="System Settings"
        subtitle="Manage company branding and application settings."
        actions={
          <Button
            leftIcon={<Plus />}
            onClick={() => {
              setEditingSetting(null);

              setOpenModal(true);
            }}
          >
            Add Setting
          </Button>
        }
      />

      <QuickStats
        stats={[
          {
            title: "Total Settings",
            value: total,
            icon: Settings,
            iconColor: "text-info",
            bgColor: "stat-total",
          },
          {
            title: "Companies",
            value: settings.length,
            icon: Building2,
            iconColor: "text-success",
            bgColor: "stat-active",
          },
          {
            title: "Emails",
            value: settings.filter((item) => item.companyEmail).length,
            icon: Mail,
            iconColor: "text-primary",
            bgColor: "stat-current",
          },
        ]}
      />

      <SystemSettingTable
        data={settings}
        total={total}
        page={page}
        perPage={limit}
        search={search}
        onSearch={setSearch}
        onPageChange={setPage}
        onEdit={handleEdit}
        onRefresh={refetch}
        isLoading={isLoading || isFetching}
      />

      <SystemSettingModal
        open={openModal}
        initialData={editingSetting}
        onClose={() => {
          setOpenModal(false);

          setEditingSetting(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={dialog.open}
        title="Notification"
        description={dialog.message}
        variant="success"
        cancelText="Close"
        onClose={() =>
          setDialog({
            open: false,
            message: "",
          })
        }
      />
    </div>
  );
}
